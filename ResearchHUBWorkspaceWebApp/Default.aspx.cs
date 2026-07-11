using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace ResearchHUBWorkspaceWebApp
{
    public partial class _Default : Page
    {
        // Connection string read from Web.config's <connectionStrings> by name "DefaultConnection"
        private string DefaultConnectionString => ConfigurationManager.ConnectionStrings["DefaultConnection"]?.ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Example usage: you can call GetAllStudents() to retrieve data
                // var dt = GetAllStudents();
            }
        }

        // Example: select all students into a DataTable
        protected DataTable GetAllStudents()
        {
            var dt = new DataTable();
            var connStr = DefaultConnectionString;
            if (string.IsNullOrEmpty(connStr)) return dt;

            using (var conn = new SqlConnection(connStr))
            using (var cmd = new SqlCommand("SELECT student_roll_no, student_name, student_div FROM Students", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                da.Fill(dt);
            }

            return dt;
        }

        // Example: insert student
        protected int InsertStudent(int rollNo, string name, string div)
        {
            var connStr = DefaultConnectionString;
            if (string.IsNullOrEmpty(connStr)) return 0;

            using (var conn = new SqlConnection(connStr))
            using (var cmd = new SqlCommand("INSERT INTO Students (student_roll_no, student_name, student_div) VALUES (@roll, @name, @div)", conn))
            {
                cmd.Parameters.AddWithValue("@roll", rollNo);
                cmd.Parameters.AddWithValue("@name", (object)name ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@div", (object)div ?? DBNull.Value);
                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        // Example: update student
        protected int UpdateStudent(int rollNo, string name, string div)
        {
            var connStr = DefaultConnectionString;
            if (string.IsNullOrEmpty(connStr)) return 0;

            using (var conn = new SqlConnection(connStr))
            using (var cmd = new SqlCommand("UPDATE Students SET student_name = @name, student_div = @div WHERE student_roll_no = @roll", conn))
            {
                cmd.Parameters.AddWithValue("@roll", rollNo);
                cmd.Parameters.AddWithValue("@name", (object)name ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@div", (object)div ?? DBNull.Value);
                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        // Example: delete student
        protected int DeleteStudent(int rollNo)
        {
            var connStr = DefaultConnectionString;
            if (string.IsNullOrEmpty(connStr)) return 0;

            using (var conn = new SqlConnection(connStr))
            using (var cmd = new SqlCommand("DELETE FROM Students WHERE student_roll_no = @roll", conn))
            {
                cmd.Parameters.AddWithValue("@roll", rollNo);
                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
    }
}