CREATE PROCEDURE dbo.spUpdateGoodDetails
    @ProductID INT,
    @ProductName VARCHAR(100),
    @Price DECIMAL(10,2),
    @Stock INT,
    @Description TEXT
AS
BEGIN
    UPDATE dbo.Goods
    SET
        ProductName = @ProductName,
        Price = @Price,
        Stock = @Stock,
        Description = @Description
    WHERE
        ProductID = @ProductID;
    
    SELECT *
    FROM dbo.Goods
    WHERE ProductID = @ProductID;
END
