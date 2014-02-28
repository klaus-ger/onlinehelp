<?php

namespace T3developer\T3devOlinehelp\Controller;

/* * *************************************************************
 *  Copyright notice
 *
 *  (c) 2013 Klaus Heuer <klaus.heuer@t3-developer.com>
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 * ************************************************************* */

/**
 *
 *
 * @package t3dev_onlinehelp
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 or later
 *
 */
class ChatController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController {

    /**
     * Initializes the current action 
     * @return void 
     */
    public function initializeAction() {
        
    }

    /**
     * Index Action: Shows a list of all User
     */
    public function indexAction() {

        if ($this->request->hasArgument('function')) {
            $function = $this->request->getArgument('function');
        }
        if ($this->request->hasArgument('message')) {
            $message = $this->request->getArgument('message');
        }
        if ($this->request->hasArgument('state')) {
            $state = $this->request->getArgument('state');
        }
        if ($this->request->hasArgument('nickname')) {
            $nickname = $this->request->getArgument('nickname');
        }



        $log = array();

        switch ($function) {

            case('getState'):
                if (file_exists('uploads/chat.txt')) {
                    $lines = file('uploads/chat.txt');
                }
                $log['state'] = count($lines);
                break;

            case('update'):

                if (file_exists('uploads/chat.txt')) {
                    $lines = file('uploads/chat.txt');
                }
                $count = count($lines);
                if ($state == $count) {
                    $log['state'] = $state;
                    $log['text'] = false;
                } else {
                    $text = array();
                    $log['state'] = $state + count($lines) - $state;
                    foreach ($lines as $line_num => $line) {
                        if ($line_num >= $state) {
                            $text[] = $line = str_replace("\n", "", $line);
                        }
                    }
                    $log['text'] = $text;
                }

                break;

            case('send'):
                $nickname = urldecode($nickname);
                //$nickname = mb_convert_encoding($nickname, "UTF-8", "auto");
                //$nickname = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;",urldecode($nickname));
                //$nickname = htmlentities(strip_tags($nickname));
                $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
                //$message = htmlentities(strip_tags($message),ENT_QUOTES | ENT_IGNORE, "UTF-8");
                $nickname = htmlentities(strip_tags($nickname), ENT_QUOTES | ENT_IGNORE, "UTF-8");
                if (($message) != "\n") {
                    if (preg_match($reg_exUrl, $message, $url)) {
                        //$message = preg_replace($reg_exUrl, '<a href="'.$url[0].'" target="_blank">'.$url[0].'</a>', $message);
                    }
                    $date = '';
                    $date = date('H:i');


                    fwrite(fopen('uploads/chat.txt', 'a'), "<div class='chat-entry'><div class='date'>" . $date . "</div><div class='name'>" . $nickname . "</div><div class='entry'>" . $message = str_replace("\n", " ", $message) . "</div></div>" . "\n");
                }
                break;

            case('load'):

                if (file_exists('uploads/chat.txt')) {
                    $lines = file('uploads/chat.txt');
                }
                $count = count($lines);
                $text = array();

                foreach ($lines as $line_num => $line) {
                    if ($line_num >= $count - 10) {
                        $text[] = $line = str_replace("\n", "", $line);
                    }
                }
                $log['text'] = $text;

                break;
        }
        return json_encode($log);
    }

}

?>