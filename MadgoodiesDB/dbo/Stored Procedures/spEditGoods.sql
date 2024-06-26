CREATE PROCEDURE [dbo].[spEditGoods]
    @ProductID INT,
    @ProductName VARCHAR(100),
    @Price DECIMAL(10,2),
    @Stock INT,
    @Description TEXT,
    @Image VARBINARY(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [dbo].[Goods]
    SET [ProductName] = @ProductName,
        Price = @Price,
        Stock = @Stock,
        [Description] = @Description,
        Image = @Image
    WHERE ProductID = @ProductID;
END