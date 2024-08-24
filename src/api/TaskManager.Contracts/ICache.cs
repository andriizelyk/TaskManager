namespace TaskManager.Contracts;

public interface ICache
{
    Task<T?> GetAsync<T>(string key, Func<Task<T>> factory);
}