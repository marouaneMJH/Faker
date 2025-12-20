describe("Test Setup", () => {
    it("should run basic test", () => {
        expect(1 + 1).toBe(2);
    });

    it("should handle async operations", async () => {
        const promise = Promise.resolve(42);
        const result = await promise;
        expect(result).toBe(42);
    });
});
