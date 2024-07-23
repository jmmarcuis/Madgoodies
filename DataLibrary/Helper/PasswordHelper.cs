using Microsoft.AspNetCore.Identity;

namespace DataLibrary.Helper
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            var passwordHasher = new PasswordHasher<object>();
            return passwordHasher.HashPassword(null, password);
        }

        public static bool VerifyHashedPassword(string hashedPassword, string providedPassword)
        {
            var passwordHasher = new PasswordHasher<object>();
            var result = passwordHasher.VerifyHashedPassword(null, hashedPassword, providedPassword);
            return result == PasswordVerificationResult.Success;
        }
    }
}
