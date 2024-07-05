CREATE PROCEDURE [dbo].[spDeleteGood]
    @ProductID INT
AS
BEGIN
    UPDATE Goods
    SET IsDeleted = 1
    WHERE ProductID = @ProductID;
END