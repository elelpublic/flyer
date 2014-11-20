// (C) 1998-2015 Information Desire Software GmbH
// www.infodesire.com

package com.infodesire.infomarket;

import com.google.common.collect.Iterators;

import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.collections.iterators.EnumerationIterator;


/**
 * A request header which can be used in servlet filters to add header values. 
 *
 */
public class RequestWithAddedHeaders extends HttpServletRequestWrapper {

 
  private Map<String, String> headers = new HashMap<String, String>();

  public RequestWithAddedHeaders( HttpServletRequest request ) {
    super( request );
  }

  /**
   * Add a http header
   * 
   * @param name Header name
   * @param value Header value
   * 
   */
  public void addHeader( String name, String value ) {
    headers.put( name, value );
  }

  /* (non-Javadoc)
   * @see javax.servlet.http.HttpServletRequestWrapper#getHeader(java.lang.String)
   */
  @Override
  public String getHeader( String name ) {
    if( headers.containsKey( name ) ) {
      return headers.get( name );
    }
    else {
      return super.getHeader( name );
    }
  }

  /* (non-Javadoc)
   * @see javax.servlet.http.HttpServletRequestWrapper#getHeaderNames()
   */
  @SuppressWarnings("rawtypes")
  @Override
  public Enumeration getHeaderNames() {
    
    if( headers.isEmpty() ) {
      return super.getHeaderNames();
    }
    else {
      @SuppressWarnings("unchecked")
      Iterator<String> parentNames = new EnumerationIterator( super.getHeaderNames() );
      Iterator<String> addedNames = headers.keySet().iterator();
      Iterator<String> allNames = Iterators.concat( parentNames, addedNames );
      return Iterators.asEnumeration( allNames );    
    }

  }

  /* (non-Javadoc)
   * @see javax.servlet.http.HttpServletRequestWrapper#getHeaders(java.lang.String)
   */
  @SuppressWarnings("rawtypes")
  @Override
  public Enumeration getHeaders( String name ) {
    if( headers.containsKey( name ) ) {
      return Collections.enumeration( Collections.singleton( headers.get( name ) ) );
    }
    else {
      return super.getHeaders( name );
    }
  }
  

}


