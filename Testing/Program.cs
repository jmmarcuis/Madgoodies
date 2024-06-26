using DataLibrary.Data;
using DataLibrary.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using DataLibrary.Database;

namespace Testing
{
    internal class Program
    {
        static void Main(string[] args)
        {
            SqlData db = GetConnection();
            bool running = true;

            while (running)
            {
                Console.Clear();
                Console.WriteLine("Test Stored Procedures!");
                Console.WriteLine("Please select an option:");
                Console.WriteLine("1. Auth");
                Console.WriteLine("2. add goods");
                Console.WriteLine("3. delete goods");
                Console.WriteLine("4. edit goods");
                Console.WriteLine("5. view goods");
                Console.WriteLine("6. exit");

                Console.Write("Enter your choice (1-6): ");
                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        Authenticate(db);
                        break;
                    case "2":
                        AddGood(db);
                        break;
                    case "3":
                        DeleteGood(db);
                        break;
                    case "4":
                        EditGood(db);
                        break;
                    case "5":
                        ViewGoods(db);
                        break;
                    case "6":
                        running = false;
                        Console.WriteLine("Exiting the application...");
                        break;

                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }

                Console.WriteLine("Press Enter to continue...");
                Console.ReadLine();
            }
        }

        private static UserModel GetCurrentUser(SqlData db)
        {
            Console.Write("Username: ");
            string username = Console.ReadLine();

            Console.Write("Password: ");
            string password = Console.ReadLine();

            UserModel user = db.Authenticate(username, password);

            return user;
        }

        static SqlData GetConnection()
        {
            var builder = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json");

            IConfiguration config = builder.Build();
            ISqlDataAccess dbAccess = new SqlDataAccess(config);
            SqlData db = new SqlData(dbAccess);

            return db;
        }

        public static void Authenticate(SqlData db)
        {
            UserModel user = GetCurrentUser(db);

            if (user == null)
            {
                Console.WriteLine("Invalid Credentials.");
            }
            else
            {
                Console.WriteLine($"Welcome, {user.UserName}");
            }
        }

        public static void AddGood(SqlData db)
        {
            Console.Write("Enter Product Name: ");
            string productName = Console.ReadLine();

            Console.Write("Enter Price: ");
            decimal price = decimal.Parse(Console.ReadLine());

            Console.Write("Enter Stock: ");
            int stock = int.Parse(Console.ReadLine());

            Console.Write("Enter Description: ");
            string description = Console.ReadLine();

            byte[] image = null;
            string imageBase64 = "";

            Console.Write("Do you want to add an image? (y/n): ");
            string imageChoice = Console.ReadLine();

            if (imageChoice.ToLower() == "y")
            {
                Console.Write("Enter Image (base64 string): ");
                imageBase64 = Console.ReadLine();
                image = Convert.FromBase64String(imageBase64);
            }

            db.AddGood(
              productName,
              price,
              stock,
              description,
              image);

            Console.WriteLine($"New good: {productName} - Price: {price} - Stock: {stock} | added successfully.");
        }

        public static void DeleteGood(SqlData db)
        {

            IEnumerable<CreateGood> goods = db.GetAllGoods();

            Console.WriteLine("List of Goods:");
            foreach (var good in goods)
            {
                Console.WriteLine($"ID: {good.ProductID} - Name: {good.ProductName} - Price: {good.Price} - Stock: {good.Stock}");
            }

            Console.Write("Enter the Product ID to delete: ");
            int productID = int.Parse(Console.ReadLine());

            CreateGood goodToDelete = goods.FirstOrDefault(g => g.ProductID == productID);

            if (goodToDelete != null)
            {
                Console.WriteLine($"Deleting {goodToDelete.ProductName}...");

                for (int i = 3; i > 0; i--)
                {
                    Console.Write($"{i}... ");
                    Thread.Sleep(1000);
                }
                Console.WriteLine();

                db.DeleteGood(productID);

                Console.WriteLine($"The {goodToDelete.ProductName} has been removed.");
            }
            else
            {
                Console.WriteLine("Invalid Product ID. No good found to delete.");
            }
        }

        public static void EditGood(SqlData db)
        {
            IEnumerable<CreateGood> goods = db.GetAllGoods();

            Console.WriteLine("List of Goods:");
            foreach (var good in goods)
            {
                Console.WriteLine($"ID: {good.ProductID} - Name: {good.ProductName} - Price: {good.Price} - Stock: {good.Stock}");
            }

            Console.Write("Enter the Product ID to edit: ");
            int productID = int.Parse(Console.ReadLine());

            CreateGood goodToEdit = goods.FirstOrDefault(g => g.ProductID == productID);

            if (goodToEdit != null)
            {
                Console.WriteLine($"Editing {goodToEdit.ProductName}...");

                Console.Write($"New Product Name (current: {goodToEdit.ProductName}): ");
                string newProductName = Console.ReadLine();

                Console.Write($"New Price (current: {goodToEdit.Price}): ");
                decimal newPrice = decimal.Parse(Console.ReadLine());

                Console.Write($"New Stock (current: {goodToEdit.Stock}): ");
                int newStock = int.Parse(Console.ReadLine());

                Console.Write($"New Description (current: {goodToEdit.Description}): ");
                string newDescription = Console.ReadLine();

                byte[] newImage = null;
                string imageBase64 = "";

                Console.Write("Do you want to update the image? (y/n): ");
                string imageChoice = Console.ReadLine();

                if (imageChoice.ToLower() == "y")
                {
                    Console.Write("Enter new Image (base64 string): ");
                    imageBase64 = Console.ReadLine();
                    newImage = Convert.FromBase64String(imageBase64);
                }

                EditGood updatedGood = new EditGood
                {
                    ProductID = productID,
                    ProductName = newProductName,
                    Price = newPrice,
                    Stock = newStock,
                    Description = newDescription,
                    Image = newImage
                };

                db.EditGood(updatedGood);

                Console.WriteLine($"The {goodToEdit.ProductName} has been updated.");
            }
            else
            {
                Console.WriteLine("Invalid Product ID. No good found to edit.");
            }
        }
        public static void ViewGoods(SqlData db)
        {

            IEnumerable<CreateGood> goods = db.GetAllGoods();

            Console.WriteLine("List of Goods:");
            foreach (var good in goods)
            {
                Console.WriteLine($"ID: {good.ProductID} - Name: {good.ProductName} - Price: {good.Price} - Stock: {good.Stock}");
            }
        }
    }
}