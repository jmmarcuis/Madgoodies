CREATE PROCEDURE dbo.spAddProductPackaging
    @ProductID INT,
    @PackageQuantity INT
AS
BEGIN
    INSERT INTO ProductPackaging (ProductID, PackageQuantity)
    VALUES (@ProductID, @PackageQuantity);
END
