// (C) 1998-2015 Information Desire Software GmbH
// www.infodesire.com

package com.infodesire.flyer;

import java.io.IOException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.params.HttpParams;


@SuppressWarnings("deprecation")
public class ProxyServlet extends org.mitre.dsmiley.httpproxy.ProxyServlet {


  private static final long serialVersionUID = 1L;


  /**
   * Accept all certificates
   */
  private X509TrustManager manager = new X509TrustManager() {


    public void checkClientTrusted( X509Certificate[] xcs, String string )
      throws CertificateException {
    }


    public void checkServerTrusted( X509Certificate[] xcs, String string )
      throws CertificateException {
    }


    public X509Certificate[] getAcceptedIssuers() {
      return null;
    }
  };


  /**
   * Accept all host names
   */
  private X509HostnameVerifier verifier = new X509HostnameVerifier() {


    @Override
    public void verify( String string, SSLSocket ssls ) throws IOException {
    }


    @Override
    public void verify( String string, X509Certificate xc ) throws SSLException {
    }


    @Override
    public void verify( String string, String[] strings, String[] strings1 )
      throws SSLException {
    }


    @Override
    public boolean verify( String string, SSLSession ssls ) {
      return true;
    }
  };


  @Override
  protected HttpClient createHttpClient( HttpParams hcParams ) {

    try {

      SSLContext ctx = SSLContext.getInstance( "TLS" );
      ctx.init( null, new TrustManager[] { manager }, null );

      //SSLSocketFactory ssf = new SSLSocketFactory(ctx, SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
      SSLSocketFactory ssf = new SSLSocketFactory( ctx );
      ssf.setHostnameVerifier( verifier );

      ClientConnectionManager ccm = new ThreadSafeClientConnManager();
      SchemeRegistry sr = ccm.getSchemeRegistry();
      sr.register( new Scheme( "https", 443, ssf ) );

      return new DefaultHttpClient( ccm, hcParams );

    }
    catch( Exception ex ) {
      // fall back on base implementation
      ex.printStackTrace();
      return super.createHttpClient( hcParams );
    }
  }

}
