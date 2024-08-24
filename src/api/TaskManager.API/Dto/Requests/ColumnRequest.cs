namespace TaskManager.API.Dto.Requests;

public record ColumnRequest(Guid Id, Guid BoardId, string Title, string Order);