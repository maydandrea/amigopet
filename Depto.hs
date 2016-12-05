{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Depto where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postDeptoR :: Handler ()
postDeptoR = do
    depto <- requireJsonBody :: Handler Depto
    did <- runDB $ insert depto
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey did))])
