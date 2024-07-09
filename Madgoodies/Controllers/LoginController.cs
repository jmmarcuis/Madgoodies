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
                    return Ok(new { token, users = _db.GetUsers() });
                }

                return NotFound("Invalid username or password");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


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
        [HttpPost("adduser")]
         public ActionResult AddUser([FromBody] UserModel user)
        {
            try
            {
                _db.AddUser(user);
                return Ok("User added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("updateuser/{id}")]
        public ActionResult UpdateUser(int id, [FromBody] UserModel user)
        {
            try
            {
                user.Id = id; // Ensure the user ID is set correctly
                _db.UpdateUser(user);
                return Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("deleteuser/{id}")]
         public ActionResult DeleteUser(int id)
        {
            try
            {
                _db.DeleteUser(id);
                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{id}")]
         public ActionResult<UserModel> GetUser(int id)
        {
            try
            {
                var user = _db.GetUserById(id);
                if (user == null)
                {
                    return NotFound("User not found");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
