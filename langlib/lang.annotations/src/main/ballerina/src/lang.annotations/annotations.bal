// Copyright (c) 2018 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
//
// WSO2 Inc. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

# Denote that the return value is tainted.
public const annotation tainted on parameter, return, source listener, source var;

# Denote that the return value is untainted, parameter expect untainted value, type cast mark value untainted,
# denote a listener as producing untainted arguments to service resource params.
public const annotation untainted on return, parameter, source type, source listener;

# Denotes annotated type is a parametric type.
public const annotation typeParam on source type;

# Defaultable argument names. This is for internal use.
#
# + args - Defaultable argument names are set at compile time.
type ArgsData record {|
    string[] args = [];
|};

# Defaultable annotation data generated at compile time. This is for internal use.
annotation ArgsData DefaultableArgs on function;

public type Thread "parent" | "any";

# Describes Strand execution details for the runtime.
#
# + name - name of the dispatching policy (not yet supported).
# + thread - specifies whether strand should run on parent strand's thread or in any available thread.
public type StrandData record {|
	string name?;
	Thread thread = "parent";
|};

# Denotes new Strand execution semantics.
public annotation StrandData strand on worker, start;

