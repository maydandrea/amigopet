{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Pessoa where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

getPessoaR :: Handler Html
getPessoaR = do
    pers <- runDB $ selectList [] [Asc PessoaId]
    sendResponse (object [pack "resp" .= toJSON pers])