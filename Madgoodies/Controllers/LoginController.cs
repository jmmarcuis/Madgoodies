using DataLibrary.Models;
using DataLibrary.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlData _db;

        public LoginController(IConfiguration config, ISqlData db)
        {
            _config = config;
            _db = db;
        }

        private string GenerateToken(UserModel user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            string userIdStr = user.Id.ToString();
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userIdStr),
            };
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateToken(AdminModel admin)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            string adminIdStr = admin.Id.ToString();
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, adminIdStr),
        new Claim(ClaimTypes.Role, "SuperAdmin")
    };
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public ActionResult Login([FromBody] UserLogin login)
        {
            try
            {
                UserModel user = _db.Authenticate(login.UserName, login.Password);

                if (user != null)
                {
                    var token = GenerateToken(user);
                    return Ok(token);
                }

                return NotFound("Invalid username or password");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("superadminlogin")]
        public ActionResult SuperAdminLogin([FromBody] AdminLogin login)
        {
            try
            {
                AdminModel admin = _db.AuthenticateSuperAdmin(login.UserName, login.Password);

                if (admin != null)
                {
                    var token = GenerateToken(admin);
                    return Ok(token);
                }

                return NotFound("Invalid username or password");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
<<<<<<< Updated upstream
=======


        [HttpGet]
        [Route("getusers")]
        public ActionResult<IEnumerable<UserModel>> GetUsers()
        {
            try
            {
                var users = _db.GetUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("addusers")]
        public ActionResult<int> Register([FromBody] AddUserModel registerModel)
        {
            try
            {
                // Check 
                if (_db.UserExists(registerModel.UserName, registerModel.FirstName, registerModel.LastName))
                {
                    return BadRequest("User already exists");
                }

                // Register
                int newUserId = _db.Register(registerModel.UserName, registerModel.FirstName, registerModel.LastName, registerModel.Password);

                return CreatedAtAction(nameof(Register), new { id = newUserId }, newUserId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
>>>>>>> Stashed changes
    }
}
