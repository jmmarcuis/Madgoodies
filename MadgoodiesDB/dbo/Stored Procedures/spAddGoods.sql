 
CREATE PROCEDURE [dbo].[spAddGoods]
    @ProductName VARCHAR(100),
    @Price DECIMAL(10,2),
    @Stock INT,
    @Description TEXT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [dbo].[Goods] (
        [ProductName],
        Price,
        Stock,
        [Description]
     
    )
    VALUES (
        @ProductName,
        @Price,
        @Stock,
        @Description
    
    );
END
GO
