CREATE PROCEDURE dbo.spGetProductPackaging
    @ProductID INT
AS
BEGIN
    SELECT PackagingID, ProductID, PackageQuantity
    FROM ProductPackaging
    WHERE ProductID = @ProductID;
END