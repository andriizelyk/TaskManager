namespace TaskManager.Services.Dto;

public class ColumnDto
{
    public Guid Id { get; set; }
    
    public Guid BoardId { get; set; }
    
    public string Title { get; set; }

    public string Order { get; set; }
}