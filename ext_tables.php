<?php

if (!defined('TYPO3_MODE'))
    die('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        $_EXTKEY, 't3devonlinehelp', 't3dev-onlinehelp'
);





\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', 't3-developer onlinehelp');


?>