<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ResearchHUBWorkspaceWebApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <h1 style="text-align:center;">JavaScript CRUD Example Tutorial</h1>
    <hr />

    <div class="employee-form">

    <div>
    <label>Full Name*</label>
    <label class="validation-error hide" id="fullNameValidationError">
        This field is required.
    </label>
    <input type="text" name="fullName" id="fullName" />
</div>

<div>
    <label>Email Id</label>
    <input type="text" name="email" id="email" />
</div>

<div>
    <label>Roll No</label>
    <input type="text" name="rollNo" id="rollNo" />
</div>

<div>
    <label>Student Division</label>
    <input type="text" name="division" id="division" />
</div>

<div class="form-action-buttons">
    <input type="button" value="Submit" onclick="onFormSubmit()" />
</div>
</div>

    <br />

    <div class="employees-table">
        <table class="list" id="employeeList">
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Email Id</th>
                    <th>Roll No</th>
                    <th>Student Division</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>

    <script src="Scripts/JavaScript.js"></script>

</asp:Content>