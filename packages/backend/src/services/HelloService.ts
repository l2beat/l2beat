export class HelloService {
  constructor(private name: string) {}

  getMessage() {
    return `Hello from ${this.name}!`
  }
}
