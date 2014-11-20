// (C) 1998-2015 Information Desire Software GmbH
// www.infodesire.com

package com.infodesire.infomarket;

import com.google.common.base.Charsets;
import com.google.common.io.Files;

import java.io.File;
import java.io.IOException;


/**
 * Stores and retrieves application key in ~/.infomarket/KEY
 *
 */
public class KeyStore {
  
  
  private static File file = new File( new File( System.getProperty(
    "user.home", "." ) ), ".infomarket/KEY" );


  private static boolean loaded = false;
  
  
  private static String key;


  public static String getKey() throws IOException {
    if( !loaded ) {
      if( file.exists() && file.isFile() ) {
        key = Files.readFirstLine( file, Charsets.UTF_8 );
        loaded = true;
      }
    }
    return key;
  }


  public static void reload() {
    loaded = false;
  }


  public static void storeKey( String key ) throws IOException {
    file.getParentFile().mkdirs();
    Files.write( key, file, Charsets.UTF_8 );
  }
  

}


