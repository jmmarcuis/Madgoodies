CREATE PROCEDURE dbo.spAddGoods
    @ProductImageUrl VARCHAR(MAX),
    @ProductName VARCHAR(100),
    @Price DECIMAL(10,2),
    @Stock INT,
    @Description TEXT
AS
BEGIN
    INSERT INTO Goods (ProductImageUrl, ProductName, Price, Stock, Description)
    VALUES (@ProductImageUrl, @ProductName, @Price, @Stock, @Description);
END
