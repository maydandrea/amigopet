{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE TemplateHaskell      #-}
{-# LANGUAGE ViewPatterns         #-}

module Application where

import Foundation
import Yesod


import Person
import Depto

mkYesodDispatch "App" resourcesApp