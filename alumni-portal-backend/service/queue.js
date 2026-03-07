// queue.js
let queue;

(async () => {
    const { default: PQueue } = await import('p-queue');
    queue = new PQueue({ concurrency: 1 });
})();

module.exports = {
    addToQueue: async (taskFn) => {
        while (!queue) {
            await new Promise((res) => setTimeout(res, 10));
        }
        return queue.add(taskFn);
    }
};
