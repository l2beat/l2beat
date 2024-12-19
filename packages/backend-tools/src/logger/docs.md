# Logger documentation

## Levels

The logger supports the following levels, from lowest to highest:

- `TRACE` - accessed via `logger.trace(...)`.
- `DEBUG` - accessed via `logger.debug(...)`.
- `INFO` - accessed via `logger.info(...)`.
- `WARN` - accessed via `logger.warn(...)`.
- `ERROR` - accessed via `logger.error(...)`. Messages logged at this level are also reported using the `reportError` option.
- `CRITICAL` - accessed via `logger.critical(...)`. Messages logged at this level are also reported using the `reportError` option.

You can quickly obtain a logger with a specific minimum level by accessing a corresponding property on the `Logger` class:

```typescript
const logger = Logger.DEBUG
```

There is also a special `NONE` level and a corresponding `Logger.SILENT` property that can be used to disable logging.

## Options

The logger can be configured using the following options, all of them optional:

- `logLevel` - minimum level of messages that will be logged, defaults to `INFO`. See more in the [Levels](#levels) section.
- `service` - name of the service (class) that is using the logger. See more in the [Services](#services) section.
- `tag` - tag that is used to identify the logger. See more in the [Tags](#tags) section.
- `utc` - when set to true time is logged in UTC, otherwise in local time. Defaults to `false`.
- `cwd` - current working directory, used to shorten error stack traces. Defaults to `process.cwd()`.
- `getTime` - callback that returns the current time. Defaults to `() => new Date()`.
- `reportError` - callback called when a message is logged at the `ERROR` or `CRITICAL` level. See more in the [Error reporting](#error-reporting) section.
- `transports` - a set of pairs ([transport](#transports) + [formatter](#formatters)) which define where and in what form logs are being outputted. Defaults to `console` and `pretty` formatter

### Services

When there is no service assigned to the logger the messages are logged without any prefix.

```typescript
const logger = Logger.INFO
logger.info('hello')

// outputs:
// 12:34:56.789 INFO hello
```

This can be changed by assigning a service to the logger:

```typescript
const logger = Logger.INFO.for('MyService')
logger.info('hello')

// outputs:
// 12:34:56.789 INFO [ MyService ] hello
```

The `.for` method also accepts an instance of a class and so is commonly called inside the constructor:

```typescript
class MyService {
  constructor(private readonly logger: Logger) {
    this.logger = logger.for(this)
  }
  sayHello() {
    this.logger.info('hello')
  }
}

const logger = Logger.INFO
const myService = new MyService(logger)
myService.sayHello()

// outputs:
// 12:34:56.789 INFO [ MyService ] hello
```

### Tags

It is common to have multiple instances of a service running at the same time. In such cases it is useful to assign a tag to each instance so that it is easier to distinguish between them. Different services can also be assigned the same tag.

```typescript
class FamilyGreeter {
  constructor(private readonly logger: Logger) {
    this.logger = logger.for(this)
  }
  sayHello() {
    this.logger.info('hello')
  }
}

const logger = Logger.INFO
const capuletGreeter = new FamilyGreeter(logger.tag('Capulet'))
const montagueGreeter = new FamilyGreeter(logger.tag('Montague'))

capuletGreeter.sayHello()

// outputs:
// 12:34:56.789 INFO [ FamilyGreeter:Capulet ] hello

montagueGreeter.sayHello()

// outputs:
// 12:34:56.789 INFO [ FamilyGreeter:Montague ] hello
```

## Logger output

While the logger receives input in a freeform way it outputs messages in a structured format. To do so it must map the input to a predefined structure of `message`, `error` and `parameters`.

This is done using the following rules:

- all logging methods like `.info(...)` accept any number of arguments of any type
- the first string argument is treated as the message
- if there is no string argument then if any of the passed non-error object contain a `message` property with a string value it is used as the message
- the first error argument is treated as the error
- if there is no error argument then if any of the passed non-error object contain an `error` property with an error value it is used as the error
- non-object arguments are stored as `parameters.value` or `parameters.values` depending on the number of such arguments
- object arguments are merged into a single `parameters` object

## Transports

Currently we support two transports

- `console` - standard output to console
- `ElasticSearchTransport` - pushes logs ElasticSearch node (should be used together with [ECS formatter](#ecs))

## Formatters

Along with each transport it is required to provide a formatter which will produce an output string for each log entry

### Pretty

Type: `LogFormatterPretty`

In this format every message is logged on one or more lines with another newline in between the messages. The first line contains the timestamp, log level, service, tag and the message. The following lines contain a representation of the parameters. This form is best suited for local development purposes.

This formatter accepts two params:

- `utc` - when set to true time is logged in UTC, otherwise in local time. Defaults to `false`.
- `colors` - when set to true colors are used in the `pretty` format, otherwise they are not. Defaults to `false`.

Below is an example log output:

```
12:34:56.001 INFO [ PriceService:USD ] Fetched prices
    { entries: 42, upToDate: true }

12:34:56.002 ERROR [ PriceService:USD ] Error fetching prices
    {
      name: 'Error',
      error: '429: You have been rate limited!',
      stack: [
        'PriceService.fetchPrices (src/PriceService.ts:12:34)',
        'TaxService.computeTaxes (src/TaxService.ts:56:78)',
      ]
    }
```

### JSON

Type: `LogFormatterJson`

In this format every message is logged on a single line as a single JSON object. The object contains the timestamp, log level, service, tag, message, error and parameters. This format is best suited for deployment environments.

Below is an example log output:

```
{"time":"2023-01-02T12:34:56.001Z","level":"INFO","service":"PriceService:USD","message":"Fetched prices","parameters":{"entries":42,"upToDate":true}}
{"time":"2023-01-02T12:34:56.002Z","level":"ERROR","service":"PriceService:USD","message":"Error fetching prices","error":{"name":"Error","error":"429: You have been rate limited!","stack":["PriceService.fetchPrices (src/PriceService.ts:12:34)","TaxService.computeTaxes (src/TaxService.ts:56:78)"]}}
```

### ECS

Type: `LogFormatterEcs`

In this format every message is logged on a single line as a single JSON object compatible with [ECS standard](https://www.elastic.co/guide/en/ecs/current/ecs-reference.html). This format is best suited for deployment environments with ElastiSearch enabled

Below is an example log output:

```
{"@timestamp":"2024-04-25T15:47:52.731Z","log":{"level":"INFO"},"service":{"name":"Application"},"message":"Log level","parameters":{"value":"INFO"}}
{"@timestamp":"2024-04-25T15:47:52.733Z","log":{"level":"INFO"},"service":{"name":"ApiServer"},"message":"Listening","parameters":{"port":3000}}
{"@timestamp":"2024-04-25T15:47:52.864Z","log":{"level":"INFO"},"service":{"name":"Database"},"message":"Migrations completed","parameters":{"version":"105"}}
```

## Error reporting

It might be useful to connect the logger into an error reporting system. This can be done by providing a `reportError` callback that will be called when a message is logged at the `ERROR` or `CRITICAL` level.

This callback receives a single argument of type `LogEntry`, with the following properties:

- `level` - `'ERROR'` or `'CRITICAL'`
- `time` - a `Date` instance representing the time when the message was logged
- `service` - (optional) the service and tag with which the logger was configured
- `message` - (optional) the message that was logged
- `error` - (optional) the error that was logged
- `resolvedError` - (optional) a transformed error object with shortened stack trace
- `parameters` - (optional) the parameters that were logged
