namespace TaskManager.API.Dto.Responses;

public class TaskResponse
{
    public Guid ColumnId { get; set; }

    public Guid Id { get; set; }

    public string Content { get; set; }

    public string Order { get; set; }

    public string Title { get; set; }
}