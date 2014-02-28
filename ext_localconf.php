<?php
if (!defined ('TYPO3_MODE'))  die ('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
	'T3developer.' . $_EXTKEY,
	't3devonlinehelp',
	array(
		
                'Chat'   => 'index'
		
               
	    ),

    array ( 
                'Chat'   => 'index'
            )
);





?>