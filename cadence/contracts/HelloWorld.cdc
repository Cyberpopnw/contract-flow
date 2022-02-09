pub contract HelloWorld {
    pub let greetings: String
    init() {
        self.greetings = "hello world"
    }

    pub fun hello(): String {
        return self.greetings
    }
}
