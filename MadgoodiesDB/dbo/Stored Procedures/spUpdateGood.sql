CREATE PROCEDURE dbo.spUpdateGood
    @ProductID INT,
    @ProductImageUrl VARCHAR(MAX),
    @ProductName VARCHAR(100),
    @Price DECIMAL(10,2),
    @Stock INT,
    @Description TEXT
AS
BEGIN
    UPDATE dbo.Goods
    SET
        ProductImageUrl = ISNULL(@ProductImageUrl, ProductImageUrl),
        ProductName = @ProductName,
        Price = @Price,
        Stock = @Stock,
        Description = @Description
    WHERE
        ProductID = @ProductID;

    -- Optional: Return updated product details or success message
    SELECT *
    FROM dbo.Goods
    WHERE ProductID = @ProductID;
END
