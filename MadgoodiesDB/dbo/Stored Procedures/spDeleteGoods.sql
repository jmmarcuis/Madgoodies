﻿CREATE PROCEDURE [dbo].[spDeleteGoods]
    @ProductID INT
AS
BEGIN
    DELETE FROM Goods
    WHERE ProductID = @ProductID
END
