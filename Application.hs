{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE TemplateHaskell      #-}
{-# LANGUAGE ViewPatterns         #-}

module Application where

import Foundation
import Yesod


import Pessoa
import Login

mkYesodDispatch "App" resourcesApp