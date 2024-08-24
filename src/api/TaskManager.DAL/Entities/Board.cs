namespace TaskManager.DAL.Entities;

public class Board
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Title { get; set; }

    public string Order { get; set; }
}