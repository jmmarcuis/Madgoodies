﻿CREATE PROCEDURE [dbo].[spGetAllGoods]
AS
BEGIN
    SELECT 
        ProductID,
        ProductImageUrl,
        ProductName,
        Price,
        Stock,
        Description
    FROM 
        Goods WHERE IsDeleted = 0;
END
