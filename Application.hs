{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE TemplateHaskell      #-}
{-# LANGUAGE ViewPatterns         #-}

module Application where

import Foundation
import Yesod


import Pessoa
import Pet
import Adocao
import Interessado
import Login

mkYesodDispatch "App" resourcesApp