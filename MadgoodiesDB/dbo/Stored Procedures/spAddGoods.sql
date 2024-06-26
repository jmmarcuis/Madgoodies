CREATE PROCEDURE [dbo].[spAddGoods]
    @ProductName VARCHAR(100),
    @Price DECIMAL(10,2),
    @Stock INT,
    @Description TEXT,
    @Image VARBINARY(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [dbo].[Goods] (
        [ProductName],
        Price,
        Stock,
        [Description],
        Image
    )
    VALUES (
        @ProductName,
        @Price,
        @Stock,
        @Description,
        @Image
    );
END