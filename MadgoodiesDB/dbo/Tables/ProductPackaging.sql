CREATE TABLE [dbo].[ProductPackaging]
(
    PackagingID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ProductID INT NOT NULL,
    PackageQuantity INT NOT NULL, -- e.g., 1, 4, 6, 8, 12
    FOREIGN KEY (ProductID) REFERENCES Goods(ProductID),
    UNIQUE (ProductID, PackageQuantity) -- Ensures unique package quantities for each product
);