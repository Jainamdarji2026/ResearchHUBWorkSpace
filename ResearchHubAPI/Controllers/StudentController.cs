using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;
using ResearchHubAPI.Models;

namespace ResearchHubAPI.Controllers
{
    public class StudentController : ApiController
    {
        private readonly string _connStr = ConfigurationManager.ConnectionStrings["DefaultConnection"]?.ConnectionString;

        // GET api/student
        public IHttpActionResult Get()
        {
            var students = new List<Student>();
            try
            {
                using (var conn = new SqlConnection(_connStr))
                using (var cmd = new SqlCommand("SELECT student_roll_no, student_name, student_div FROM Students", conn))
                {
                    conn.Open();
                    using (var rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            students.Add(new Student
                            {
                                student_roll_no = rdr.GetInt32(0),
                                student_name = rdr.IsDBNull(1) ? null : rdr.GetString(1),
                                student_div = rdr.IsDBNull(2) ? null : rdr.GetString(2)
                            });
                        }
                    }
                }

                return Ok(students);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // GET api/student/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                Student student = null;
                using (var conn = new SqlConnection(_connStr))
                using (var cmd = new SqlCommand("SELECT student_roll_no, student_name, student_div FROM Students WHERE student_roll_no = @id", conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    conn.Open();
                    using (var rdr = cmd.ExecuteReader())
                    {
                        if (rdr.Read())
                        {
                            student = new Student
                            {
                                student_roll_no = rdr.GetInt32(0),
                                student_name = rdr.IsDBNull(1) ? null : rdr.GetString(1),
                                student_div = rdr.IsDBNull(2) ? null : rdr.GetString(2)
                            };
                        }
                    }
                }

                if (student == null) return NotFound();
                return Ok(student);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST api/student
        public IHttpActionResult Post([FromBody] Student student)
        {
            if (student == null) return BadRequest("student is null");
            try
            {
                using (var conn = new SqlConnection(_connStr))
                using (var cmd = new SqlCommand("INSERT INTO Students (student_roll_no, student_name, student_div) VALUES (@roll, @name, @div)", conn))
                {
                    cmd.Parameters.AddWithValue("@roll", student.student_roll_no);
                    cmd.Parameters.AddWithValue("@name", (object)student.student_name ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@div", (object)student.student_div ?? DBNull.Value);
                    conn.Open();
                    var rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return Ok();
                    return InternalServerError();
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // PUT api/student/5
        public IHttpActionResult Put(int id, [FromBody] Student student)
        {
            if (student == null) return BadRequest("student is null");
            try
            {
                using (var conn = new SqlConnection(_connStr))
                using (var cmd = new SqlCommand("UPDATE Students SET student_name = @name, student_div = @div WHERE student_roll_no = @roll", conn))
                {
                    cmd.Parameters.AddWithValue("@roll", id);
                    cmd.Parameters.AddWithValue("@name", (object)student.student_name ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@div", (object)student.student_div ?? DBNull.Value);
                    conn.Open();
                    var rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return Ok();
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE api/student/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                using (var conn = new SqlConnection(_connStr))
                using (var cmd = new SqlCommand("DELETE FROM Students WHERE student_roll_no = @roll", conn))
                {
                    cmd.Parameters.AddWithValue("@roll", id);
                    conn.Open();
                    var rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return Ok();
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
