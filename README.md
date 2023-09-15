

# О продукте

**Audiogram** – это сервис на базе нейронных сетей и методов машинного обучения для распознавания и синтеза речи. Audiogram позволяет выполнять:

* **Синхронное распознавание речи**. В этом случае сервис получает запрос с аудиофайлом, который необходимо расшифровать, и возвращает распознанный текст. Данный способ выполняется последовательно и считается наиболее точным. Подходит, например, для расшифровки телефонных разговоров.

* **Потоковое распознавание речи**. В случае потокового распознавания устанавливается соединение с Audiogram, по которому речь говорящего отправляется на распознавание частями в режиме online. Сервис возвращает результаты расшифровки по мере обработки. Данный способ подходит, например, для создания голосовых помощников или субтитров к видео.

* **Синхронный синтез речи**. При синхронном синтезе запрос к Audiogram содержит текст, который необходимо озвучить, и дополнительную информацию по голосу, частоте дискретизации и кодировке. В ответ возвращается аудиофайл с озвученным текстом. Этот способ может использоваться, например, для озвучивания книг.

* **Потоковый синтез речи**. При потоковом синтезе текст отправляется в Audiogram и озвучивается по частям. Потоковый синтез подходит, например, для создания ответных реплик голосовых помощников, так как позволяет достичь эффекта живого общения без неестественных пауз.

* **Сбор аудиоартефактов**. Аудиофайлы, поступающие в Audiogram на распознавание речи, сохраняются в отдельном хранилище и могут быть использованы для обучения и усовершенствования ML-моделей, отвечающих за расшифровку речи.

* **Управление клиентами и просмотр статистики**. Это можно сделать с помощью удобного веб-клиента в любом браузере.

# Термины в документе

* **Audiogram** (также **Продукт**, **Система**) – сервис, выполняющий услуги по распознаванию речи (превращению аудиозаписей с речью в текст) и синтезированию речи (озвучиванию текстов).

* **ASR** (**Automatic Speech Recognition**) – запрос на распознавание речи.

* **TTS** (**Text-to-Speech**) – запрос на синтезирование речи.

* **ML-модель** (также **нейросеть**, **искусственный интеллект**) – программа, обученная распознаванию определенных типов закономерностей, которая используется в Audiogram для автоматизации и ускорения выполнения запросов на синтез и распознавание речи. В Audiogram используются различные ML-модели (в зависимости от типа запроса и деталей запросов).

* **Бот** (также **чат-бот**, **электронный помощник**) – программа, отвечающая на запросы пользователей и имитирующая живое общение между людьми.

# Справочник API

## Распознавание речи

Для взаимодействия с API распознавания речи используется протокол gRPC.

**Примечание**: Подробности об этом протоколе можно прочитать на https://grpc.io/

Чтобы пользоваться сервисом **Audiogram** для распознавания речи нужно создать клиентское приложение. Можно использовать любой язык программирования, который есть в библиотеке для работы с gRPC.

При написании приложения используйте proto-файл **stt.proto** (см. описание ниже).

Максимальная длина сообщения, принимаемого от клиентов по gRPC (в байтах): 31457280

### PROTO-файл stt.proto

```
syntax = "proto3";
 
import "google/protobuf/duration.proto";
import "google/protobuf/empty.proto";
 
package mts.ai.audiogram.stt.v2;
 
// ==== [begin] Voice Activity [begin] ====
// VADMark определяет разметку голосовой активности во входном акустическом сигнале.
// Сообщение включает в себя метку времени и тип метки.
message VoiceActivityMark {
  enum VoiceActivityMarkType {
    VA_MARK_NONE = 0;
    VA_MARK_BEGIN = 1;
    VA_MARK_END = 2;
  }
 
  VoiceActivityMarkType mark_type = 1; // тип разметки
  uint64 offset_ms = 2; // метка времени с точкой отсчета начала входного акустического сигнала, единицы измерения: миллисекунды
}
enum VoiceActivityDetectionAlgorithmUsage {
  USE_VAD = 0; // включает использование VAD-алгоритма для разбиения на фразы (VAD - Voice Activity Detection)
  DO_NOT_PERFORM_VOICE_ACTIVITY = 1; // отключает разбиение на фразы по Voice Activity. То есть весь распознанный текст будет получен в виде одной фразы.
  USE_DEP = 2; // включает использование DEP-алгоритма для разбиения на фразы
}
 
enum VoiceActivityMarkEventsMode {
  // Режим отправки VoiceActivity разметки клиенту
  VA_DISABLE = 0; // отключить отправку отметок VoiceActivityMark.
  VA_ENABLE = 1; // включить отправку отметок VoiceActivityMark синхронно вместе с транскрипцией
  VA_ENABLE_ASYNC = 2; /* включить отправку отметок VoiceActivityMark асинхронно
                        ( как только будет получена разметка не дожидаясь работы asr). Для файлового режима работает идентично ENABLE*/
}
 
message VADOptions {
  enum VoiceActivityDetectionMode {
    // Выбор типа разметки VAD-ом аудио
    VAD_MODE_DEFAULT = 0; // Значение по умолчанию для файлового режима - ONLY_SPEECH, для стримового режима - SPLIT_BY_PAUSES
    SPLIT_BY_PAUSES = 1; // аудио разделяется по паузам (ничего не вырезается)
    ONLY_SPEECH = 2; // вырезаются только сегменты с речью
  }
  float threshold = 1; /* Порог срабатывания VAD. Если вероятность речи выше порога,
   значит обработанный чанк содержит речь. Возможные значения: (0, 1.0]. Значение по умолчанию - 0.2 */
  int32 speech_pad_ms = 2; /* Отступ, добавляемый к границам найденных фрагментов (если speech_pad_ms < 0, отступ будет "внутрь" фрагмента).
  Единицы измерения - миллисекунды. Значение по умолчанию - 300 */
  uint32 min_silence_ms = 3; /* Если между двумя фрагментами речи встречается пауза короче min_silence_ms,
  то такая пауза не учитывается и фрагменты объединяются в один.
  Единицы измерения - миллисекунды. Возможные значения: min_silence_ms >= 0. Значение по умолчанию - 500*/
  uint32 min_speech_ms = 4; /* Минимальная продолжительность речи. Фрагменты короче min_speech_ms не учитываются. Единицы измерения - миллисекунды.
  Возможные значения: min_speech_ms >= 0. Значение по умолчанию - 250*/
  VoiceActivityDetectionMode mode = 5; //* Выбор типа разметки VAD-ом аудио файла для файлового запроса. */
}
 
message DEPOptions {
  float smoothed_window_threshold = 1; /* Порог срабатывания алгоритма DEP. На заданном окне сглаживания считается среднее значение верояности завершения фразы. Если это значение больше порога то алгоритм срабатывает.
  Возможные значения: (0, 1.0). Значение по умолчанию - 0.754 */
  int32 smoothed_window_ms = 2; /* Окно, на котором происходит сглаживание при принятии решения о конце фразы.
  Единицы измерения - миллисекунды. Возможные значения: smoothed_window_ms >= 10.
  Значение по умолчанию - 970 мс. Значение должно быть кратно 10 мс */
}
 
message VoiceActivityConfig {
  VoiceActivityDetectionAlgorithmUsage usage = 1; /* выбор алгоритма VoiceActivity. При DO_NOT_PERFORM_VOICE_ACTIVITY разметка аудио выключена.
  Значение по умолчанию - USE_VAD */
  oneof algo_options {
    VADOptions vad_options = 2; // опции алгоритма VAD. Используется при VoiceActivityDetectionAlgorithmUsage = USE_VAD
    DEPOptions dep_options = 3; // опции алгоритма DEP. Используется при VoiceActivityDetectionAlgorithmUsage = USE_DEP
  }
}
// ==== [end] Voice Activity [end] ====
 
enum AudioEncoding {
  ENCODING_UNSPECIFIED = 0;
  LINEAR_PCM = 1;
  FLAC = 2;
  MULAW = 3;
  ALAW = 20;
}
 
message RecognitionConfig {
  AudioEncoding encoding = 1;
  int32 sample_rate_hertz = 2;
  string language_code = 3;
  int32 max_alternatives = 4;
  int32 audio_channel_count = 7;
  bool enable_word_time_offsets = 8;
  bool enable_automatic_punctuation = 11;
  string model = 13;
  VoiceActivityConfig va_config = 14; // Конфигурация Voice Activity
  VoiceActivityMarkEventsMode va_response_mode = 15;  // режим отправки разметки клиенту. default - VA_DISABLE
}
 
message StreamingRecognitionConfig {
  reserved 4;
  RecognitionConfig config = 1;
  bool single_utterance = 2;
  bool interim_results = 3;
}
 
message StreamingRecognizeRequest {
  oneof streaming_request {
    StreamingRecognitionConfig streaming_config = 1;
    bytes audio = 2;
  }
}
 
message RecognitionAudio {
  oneof audio_source {
    bytes audio = 1;
    string uri = 2; // not supported
  }
}
 
message RecognizeRequest {
  RecognitionConfig config = 1;
  RecognitionAudio audio_content = 2;
}
 
message LongRunningRecognizeRequest {
  RecognitionConfig config = 1;
  RecognitionAudio audio_content = 2;
}
 
message RecognizeResponse {
  repeated SpeechRecognitionResult results = 1;
}
 
message StreamingRecognizeResponse {
  repeated StreamingRecognitionResult results = 1;
}
 
 
message SpeechRecognitionAlternative {
 
  message WordInfo {
    google.protobuf.Duration start_time = 1;
    google.protobuf.Duration end_time = 2;
    string word = 3;
    float confidence = 4;
  }
  string transcript = 1;
  float confidence = 2;
  repeated WordInfo words = 3;
  google.protobuf.Duration start_time = 4;
  google.protobuf.Duration end_time = 5;
}
 
message StreamingRecognitionResult {
  SpeechRecognitionResult result = 1;
  bool is_final = 2;
}
 
message SpeechRecognitionResult {
  repeated SpeechRecognitionAlternative alternatives = 1;
  int32 channel = 2;
  repeated VoiceActivityMark va_marks = 3; /* Voice Activity разметка. Массив меток отправляется только если VoiceActivityMarkEventsMode = VA_ENABLE / VA_ENABLE_ASYNC
  Отметим, что при VoiceActivityMarkEventsMode = VA_ENABLE_ASYNC все остальные поля структуры SpeechRecognitionResult могут быть пустые */
}
 
message ModelsInfo {
  repeated ModelInfo models = 1;
}
 
message ModelInfo {
  string name = 1;
  uint32 sample_rate_hertz = 2;
  string language_code = 3;
}
 
service STT {
  rpc Recognize(RecognizeRequest) returns (RecognizeResponse);
  rpc StreamingRecognize (stream StreamingRecognizeRequest) returns (stream StreamingRecognizeResponse);
  rpc GetModelsInfo(google.protobuf.Empty) returns (ModelsInfo);
}
```

### Методы

При обращении по gRPC-протоколу клиентское приложение использует нужный метод сервиса.

#### Recognize – распознавание аудио целиком

| Имя метода    | Тип запроса       | Тип ответа        | Описание |
| :------------ |:------------------| :-----------------|:---------|
| Recognize     | RecognizeRequest  | RecognizeResponse |Метод распознавания аудиофайла целиком. Ожидает аудиофайл, в этом же соединении возвращает результат целиком и закрывает соединение.|

#### StreamingRecognize – потоковое распознавание речи

| Имя метода    | Тип запроса       | Тип ответа        | Описание |
| :------------ |:------------------| :-----------------|:---------|
| StreamingRecognize     | stream StreamingRecognizeRequest  | stream StreamingRecognizeResponse |Метод поточного распознавания. Принимает аудиоданные по мере их доступности. Распознавание заканчивается, когда поток закрывается клиентом.|

#### GetModelsInfo – запрос моделей для распознавания речи

| Имя метода    | Тип запроса       | Тип ответа        | Описание |
| :------------ |:------------------| :-----------------|:---------|
| GetModelsInfo     | google.protobuf.Empty  | ModelsInfo |Метод запроса списка моделей для распознавания речи. Ничего не принимает в качестве аргументов, возвращает список доступных моделей.|

### Сообщения PROTOBUF для распознавания речи

#### VoiceActivityMark – определяет разметку голосовой активности во входном акустическом сигнале. Сообщение включает в себя метку времени и тип метки.

| Поле          | Тип                   | Описание          |
| :------------ |:----------------------| :-----------------|
| mark_type     | VoiceActivityMarkType | Тип разметки.     |
| offset_ms     | uint64                | Метка времени с точкой отсчета начала входного акустического сигнала, единицы измерения - миллисекунды. |

#### VoiceActivityMarkType – определяет тип метки голосовой активности

| Поле          | Значение | Описание                                            |
| :------------ |:---------| :---------------------------------------------------|
| VA_MARK_NONE  | 0        | Тип метки отсутствия изменения голосовой активности.|
| VA_MARK_BEGIN | 1        | Тип метки начала голосовой активности.              |
| VA_MARK_END   | 2        | Тип метки конца голосовой активности.               |

#### VoiceActivityDetectionAlgorithmUsage – тип используемого алгоритма VoiceActivity

#### VoiceActivityMarkEventsMode – режим отправки VoiceActivity разметки клиенту

#### VADOptions – настройки работы алгоритма VAD

#### VoiceActivityDetectionMode – выбор типа разметки VAD’ом аудио

#### DEPOptions – настройки работы алгоритма DEP

#### VoiceActivityConfig – структура данных для хранения всех настроек VoiceActivity

#### AudioEncoding – поддерживаемые форматы аудиоданных

#### RecognitionConfig - конфигурация распознавания при вызове метода Recognize

#### StreamingRecognitionConfig - конфигурация распознавания при вызове метода StreamingRecognize

#### StreamingRecognizeRequest - запрос на распознавание аудио

#### RecognitionAudio – аудио, отправляемое на распознавание

#### RecognizeRequest – запрос на распознавание аудио

#### RecognizeResponse – ответ с результатами распознавания для метода Recognize

#### StreamingRecognizeResponse - ответ с результатами распознавания для метода StreamingRecognize

#### SpeechRecognitionAlternative – альтернативные гипотезы

#### WordInfo – объект, содержащий информацию, относящуюся к распознанному слову

#### StreamingRecognitionResult – результат вызова метода распознавания потокового аудио StreamingRecognize

#### SpeechRecognitionResult – результат вызова метода файлового распознавания аудио Recognize

#### ModelsInfo – доступные модели распознавания речи

#### ModelInfo – информация о модели распознавания речи

## Синтез речи

Для взаимодействия с API синтеза речи используется протокол gRPC.

**Примечание**: Подробности об этом протоколе можно прочитать на https://grpc.io/

Чтобы пользоваться сервисом **Audiogram** для синтеза речи нужно создать клиентское приложение. Можно использовать любой язык программирования, который есть в библиотеке для работы с gRPC.

При написании приложения используйте proto-файл **tts.proto** (см. описание ниже).

Максимальная длина сообщения, принимаемого от клиентов по gRPC (в байтах): 31457280

### PROTO-файл tts.proto

```
syntax = "proto3";
 
package mts.ai.audiogram.tts.v2;
import "google/protobuf/empty.proto";
 
enum AudioEncoding {
  ENCODING_UNSPECIFIED = 0;
  LINEAR_PCM = 1;
  FLAC = 2;
  MULAW = 3;
  ALAW = 20;
}
 
message SynthesizeSpeechRequest {
  oneof input_source {
    string text = 1;
    string ssml = 2;
  }
  string language_code = 3;
  AudioEncoding encoding = 4;
  int32 sample_rate_hertz = 5;
  string voice_name = 6;
}
 
message StreamingSynthesizeSpeechResponse {
  bytes audio = 1;
}
 
message SynthesizeSpeechResponse {
  bytes audio = 1;
}
 
message ModelsInfo {
  repeated ModelInfo models = 1;
}
 
message ModelInfo {
  string name = 1;
  uint32 sample_rate_hertz = 2;
  string language_code = 3;
}
 
service TTS {
  rpc StreamingSynthesize(SynthesizeSpeechRequest) returns (stream StreamingSynthesizeSpeechResponse);
  rpc Synthesize(SynthesizeSpeechRequest) returns (SynthesizeSpeechResponse);
  rpc GetModelsInfo(google.protobuf.Empty) returns (ModelsInfo);
}
```

### Методы

#### StreamingSynthesize – потоковый синтез речи

#### Synthesize – синхронный файловый синтез речи

#### GetModelsInfo – запрос моделей для синтеза речи

### Сообщения PROTOBUF для синтеза речи

#### AudioEncoding – поддерживаемые форматы аудиоданных

#### SynthesizeSpeechRequest – настройки синтеза для файлового метода синтеза речи

#### StreamingSynthesizeSpeechResponse – результат работы потокового синтеза речи

#### SynthesizeSpeechResponse – результат работы файлового синтеза речи

#### ModelsInfo - доступные модели синтеза речи

#### ModelInfo - информация о модели синтеза речи

### Использование SSML-разметки

### Примеры использования SSML-тегов

## Метаданные gRPC-запросов

## Список ML-моделей и голосов в Audiogram

### ASR kaldi

### ASR e2e

### TTS

## Сообщения об ошибках
