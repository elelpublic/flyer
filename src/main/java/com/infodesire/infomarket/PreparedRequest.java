// (C) 1998-2015 Information Desire Software GmbH
// www.infodesire.com

package com.infodesire.infomarket;

import com.google.common.base.Joiner;
import com.google.common.base.Strings;
import com.google.common.collect.Iterators;

import java.io.PrintWriter;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;


/**
 * Prepare the info found in a http request for easy access
 *
 */
public class PreparedRequest {


  private URIBuilder uriBuilder;
  private HttpServletRequest request;
  private Route route;


  public PreparedRequest( HttpServletRequest request ) throws URISyntaxException {
    uriBuilder = parse( request );
    this.request = request;
    route = Route.parse( uriBuilder.getPath() );
  }
  
  
  public HttpServletRequest getRequest() {
    return request;
  }
  
  
  public URIBuilder getURIBuilder() {
    return uriBuilder;
  }
  
  
  public Route getRoute() {
    return route;
  }


  /**
   * Create some html debug info for a request
   * <p>
   * 
   * Try it with: http://localhost:8181/api/doc1/rest?p=1&c=2
   * 
   * @param writer Target writer
   * @return Html debug info for request
   * 
   */
  public void toHTML( PrintWriter writer ) {

    writer.println( "<table border=1>" );

    line( "URL", writer );
    line( "Method", request.getMethod(), writer );
    line( "Scheme", uriBuilder.getScheme(), writer );
    line( "Host", uriBuilder.getHost(), writer );
    line( "Port", "" + uriBuilder.getPort(), writer );
    line( "Path", uriBuilder.getPath(), writer );
    line( "Fragment", uriBuilder.getFragment(), writer );
    line( "UserInfo", uriBuilder.getUserInfo(), writer );

    line( "Route", route, writer );
    
    line( "Request", writer );
    line( "AuthType", request.getAuthType(), writer );
    line( "CharacterEncoding", request.getCharacterEncoding(), writer );
    line( "ContentLength", request.getContentLength(), writer );
    line( "ContentType", request.getContentType(), writer );
    line( "ContextPath", request.getContextPath(), writer );
    line( "LocalAddr", request.getLocalAddr(), writer );
    line( "Locale", request.getLocale(), writer );
    line( "LocaleName", request.getLocalName(), writer );
    line( "LocalPort", request.getLocalPort(), writer );
    line( "PathInfo", request.getPathInfo(), writer );
    line( "PathTranslated", request.getPathTranslated(), writer );
    line( "Protocol", request.getProtocol(), writer );
    line( "RemoteAddr", request.getRemoteAddr(), writer );
    line( "RemoteHost", request.getRemoteHost(), writer );
    line( "RemotePort", request.getRemotePort(), writer );
    line( "RemoteUser", request.getRemoteUser(), writer );
    line( "RequestedSessionId", request.getRequestedSessionId(), writer );
    line( "RequestURI", request.getRequestURI(), writer );
    line( "RequestURL", request.getRequestURL(), writer );
    line( "Scheme", request.getScheme(), writer );
    line( "ServerName", request.getServerName(), writer );
    line( "ServerPort", request.getServerPort(), writer );
    line( "ServletPath", request.getServletPath(), writer );
    line( "UserPrincipal", request.getUserPrincipal(), writer );
    
    line( "QueryParameters", writer );
    for( NameValuePair param : uriBuilder.getQueryParams() ) {
      line( param.getName(), param.getValue(), writer );
    }

    line( "Parameters", writer );
    for( Object object : request.getParameterMap().entrySet() ) {
      @SuppressWarnings("rawtypes")
      Map.Entry entry = (Map.Entry) object;
      line( "" + entry.getKey(), entry.getValue(), writer );
    }
    
    line( "Headers", writer );
    for( @SuppressWarnings("rawtypes")
    Enumeration e = request.getHeaderNames(); e.hasMoreElements(); ) {
      
      String name = (String) e.nextElement();
      @SuppressWarnings("unchecked")
      String value = Joiner.on( " " ).join(
        Iterators.forEnumeration( (Enumeration<String>) request
          .getHeaders( name ) ) );
      line( name, value, writer );
      
    }

    line( "Cookies", writer );
    for( Cookie cookie : request.getCookies() ) {
      line( cookie.getName(), cookie.getValue(), writer );
    }
    
//    line( "Attributes", writer );
//    for( @SuppressWarnings("rawtypes")
//    Enumeration e = request.getAttributeNames(); e.hasMoreElements(); ) {
//      
//      String name = (String) e.nextElement();
//      line( name, request.getAttribute( name ), writer );
//      
//    }
    
    writer.println( "</table>" );

  }


  private static void line( String name, Object value, PrintWriter writer ) {
    if( value != null && value.getClass().isArray() ) {
      value = Arrays.asList( (Object[]) value );
    }
    writer.println( "<tr><td><i>" + name + "</i></td><td>" + ( value == null ? "" : value ) + "</td></tr>" );
  }

  private static void line( String title, PrintWriter writer ) {
    writer.println( "<tr><td colspan=2><b>" + ( title == null ? "" : title ) + "</b></td></tr>" );
  }


  private static URIBuilder parse( HttpServletRequest request ) throws URISyntaxException {

    String fullURL = request.getRequestURL().toString();
    String queryString = request.getQueryString();
    if( !Strings.isNullOrEmpty( queryString ) ) {
      fullURL += "?" + queryString;
    }
    
    return new URIBuilder( fullURL );

  }
  
  
  public String toString() {
    return request.getMethod() + " " + route;
  }


  /**
   * @param name Name of parameter. Query parameters are found in the URL behind the ?
   * @return Query parameter by name
   * 
   */
  public String getQueryParam( String name ) {
    for( NameValuePair param : uriBuilder.getQueryParams() ) {
      if( param.getName().equals( name ) ) {
        return param.getValue();
      }
    }
    return null;
  }


}


