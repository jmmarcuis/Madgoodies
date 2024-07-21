CREATE PROCEDURE dbo.spDeleteProductPackaging
    @ProductID INT,
    @PackagingID INT
AS
BEGIN
    -- Delete the packaging record from the database
    DELETE FROM ProductPackaging
    WHERE ProductID = @ProductID AND PackagingID = @PackagingID;
END
