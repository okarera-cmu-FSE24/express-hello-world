
class Observers {
    constructor() {
        this.observers = [];
    }

    add(observer) {
        this.observers.push(observer);
    }

    remove(socketId) {
        this.observers = this.observers.filter(observer => observer.id !== socketId);
    }

    getAll() {
        return this.observers;
    }
}

module.exports = new Observers(); 
