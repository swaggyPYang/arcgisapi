<%@ WebHandler Language="C#" Class="proxy" %>
using System;
using System.IO;
using System.Web;
using System.Web.Caching;

public class proxy : IHttpHandler {
  
    public void ProcessRequest (HttpContext context) {

        string errorText = "<html><body><textarea>{\"error\":{\"code\": 400,\"message\": \"'data' field is missing.\"}}</textarea></body></html>";
          
        // References:
        // http://msdn.microsoft.com/en-us/library/system.web.httprequest.files.aspx#Y114
        // http://msdn.microsoft.com/en-us/library/4sf6tht4.aspx
        // http://msdn.microsoft.com/en-us/library/system.web.httppostedfile.aspx
        // http://msdn.microsoft.com/en-us/library/system.web.httppostedfile.inputstream.aspx
          
        HttpResponse response = context.Response;
        HttpFileCollection Files = context.Request.Files;
        bool foundData = false;
        
        if (Files != null) {
          // File content will be uploaded in a form field named "data"
          HttpPostedFile item = Files["data"];
          
          if (item != null) {
            byte[] input = new byte[item.ContentLength];
            Stream MyStream = item.InputStream;
            MyStream.Read(input, 0, item.ContentLength);

            response.StatusCode = 200;

            /************************************
             * Response format:
             * {
             *   "fileName":    "<string>",
             *   "contentType": "<string>",
             *   "data":        "<base64string>"
             * }
             */
            
            response.Write(
              "<html><body><textarea>{\"fileName\":\"" + 
              item.FileName.Replace("\\", "\\\\") +
              "\",\"contentType\":\"" + 
              item.ContentType + 
              "\",\"data\":\"" +
              System.Convert.ToBase64String(input) + 
              "\"}</textarea></body></html>"
            );

            foundData = true;
          }
        }
        
        if (!foundData) {
          response.StatusCode = 400;
          response.Write(errorText);
        }

        response.End();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
}
