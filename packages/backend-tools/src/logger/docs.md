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

There is also a special `NONE` setting and a corresponding `Logger.SILENT` property that can be used to disable logging. You cannot log with the `NONE` level.

## Options

The logger can be configured using the following options, all of them optional:

- `logLevel` - minimum level of messages that will be logged, defaults to `INFO`. See more in the [Levels](#levels) section.
- `transports` - objects that will output the logs somewhere. You probably want to use the `ConsoleTransport`. See the [Transports](#transports) section. Defaults to `[ConsoleTransport.PRETTY]`
- `getTime` - callback that returns the current time. Defaults to `() => new Date()`.
- `cwd` - current working directory, used to shorten error stack traces. Defaults to `process.cwd()`.

## Tags

The logger can also be tagged with various values. Those values will be added to the parameters of every log.

Some log values receive special treatment:
- `service` - displayed differently by the `ConsoleTransport` and `formatEcsLog`
- `tag` - displayed differently by the `ConsoleTransport` and `formatEcsLog`
- `feature` - special handling in `formatEcsLog`
- `module` - special handling in `formatEcsLog`
- `chain` - special handling in `formatEcsLog`
- `project` - special handling in `formatEcsLog`
- `source` - special handling in `formatEcsLog`
- `error` - inlined by `ConsoleTransport`, special handling in `formatEcsLog`

Tags can be configured by using `logger.tag({ your: 'tags' })`.

The service tag can additionally be configured by using `logger.for(service)`.

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

### Service tags

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
const capuletGreeter = new FamilyGreeter(logger.tag({ tag: 'Capulet' }))
const montagueGreeter = new FamilyGreeter(logger.tag({ tag: 'Montague' }))

capuletGreeter.sayHello()

// outputs:
// 12:34:56.789 INFO [ FamilyGreeter:Capulet ] hello

montagueGreeter.sayHello()

// outputs:
// 12:34:56.789 INFO [ FamilyGreeter:Montague ] hello
```

## Transports

While the logger receives input in a freeform way it passes messages to transports in a structured format.

Every transport receives the following to the log method:
- `time` - the time of the log
- `level` - the level of the log
- `message` - the message passed with the log
- `parameters` - other log parameters

To do so it must map the input to a predefined structure of `message`, `error` and `parameters`.

Transports can decide how the logs should be formatted and how they should be outputted. The default transport is `ConsoleTransport.PRETTY` which outputs colorful logs to the console. You can use multiple transports at the same time.

If you want to output logs to ElasticSearch use the `formatEcsLog` helper.

### Error reporting

It might be useful to connect the logger into an error reporting system. To do this just create a new transport that only reacts on error logs.
