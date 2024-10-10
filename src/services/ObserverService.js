function createObserverService() {
    let observers = [];
  
    return {
      add(observer) {
        observers.push(observer);
      },
  
      remove(socketId) {
        observers = observers.filter(observer => observer.id !== socketId);
      },
  
      getAll() {
        return observers;
      }
    };
  }
  
  module.exports = createObserverService;