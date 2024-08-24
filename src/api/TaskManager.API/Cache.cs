using Microsoft.Extensions.Caching.Memory;
using TaskManager.Contracts;

namespace TaskManager.API;

public class Cache(IMemoryCache memoryCache) : ICache
{
    public Task<T?> GetAsync<T>(string key, Func<Task<T>> factory)
    {
        return memoryCache.GetOrCreateAsync<T>(key, (ICacheEntry e) => factory());
    }
}