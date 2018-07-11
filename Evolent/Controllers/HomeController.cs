using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Evolent.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Home()
        {
            return View();
        }
		public ActionResult Error()
		{
			return View();
		}
		[HandleError()]
		public JsonResult GetCustomers()
		{
			
			EvolentDBEntities entities = new EvolentDBEntities();
			return Json(entities.Contacts);
		}
		[HttpPost]
		[HandleError()]
		public JsonResult InsertCustomer(Contact contact)
		{
			try
			{
				using (EvolentDBEntities entities = new EvolentDBEntities())
				{
					entities.Contacts.Add(contact);
					entities.SaveChanges();
				}

				return Json(contact);
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		[HttpPost]
		[HandleError()]
		public ActionResult UpdateCustomer(Contact customer)
		{
			try
			{
				using (EvolentDBEntities entities = new EvolentDBEntities())
				{
					Contact updatedCustomer = (from c in entities.Contacts
											   where c.UserID == customer.UserID
											   select c).FirstOrDefault();
					updatedCustomer.FirstName = customer.FirstName;
					updatedCustomer.LastName = customer.LastName;
					updatedCustomer.Email = customer.Email;
					updatedCustomer.PhoneNo = customer.PhoneNo;
					updatedCustomer.Status = customer.Status;
					entities.SaveChanges();
				}

				return new EmptyResult();
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		[HttpPost]
		[HandleError()]
		public ActionResult DeleteCustomer(int UserID)
		{
			try
			{
				using (EvolentDBEntities entities = new EvolentDBEntities())
				{
					Contact customer = (from c in entities.Contacts
										where c.UserID == UserID
										select c).FirstOrDefault();
					entities.Contacts.Remove(customer);
					entities.SaveChanges();
				}
				return new EmptyResult();
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}
	}
}