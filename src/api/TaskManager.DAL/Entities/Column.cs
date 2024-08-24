namespace TaskManager.DAL.Entities;

public class Column
{
    public Guid Id { get; set; }
    
    public Guid BoardId { get; set; }
    
    public string Title { get; set; }

    public string Order { get; set; }
}