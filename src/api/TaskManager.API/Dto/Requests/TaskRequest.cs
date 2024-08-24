namespace TaskManager.API.Dto.Requests;

public record TaskRequest(Guid ColumnId, Guid Id, string Content, string Order, string Title, string TitleColor);