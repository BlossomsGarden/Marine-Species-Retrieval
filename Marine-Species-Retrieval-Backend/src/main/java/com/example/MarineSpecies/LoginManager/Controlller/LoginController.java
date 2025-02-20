package com.example.MarineSpecies.LoginManager.Controlller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.MarineSpecies.Common.MyResponse;
import com.example.MarineSpecies.LoginManager.Entity.DTO.SignedIn;
import com.example.MarineSpecies.LoginManager.Entity.MenuPermission;
import com.example.MarineSpecies.LoginManager.Entity.User;
import com.example.MarineSpecies.LoginManager.Mapper.UserMapper;
import com.example.MarineSpecies.LoginManager.Entity.Admin;
import com.example.MarineSpecies.LoginManager.Mapper.AdminMapper;
import com.example.MarineSpecies.LoginManager.Mapper.MenuPermissionMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 用户登录及目录权限管理方面的Controller类
 *
 * @author ************
 * @since 2024-03-23
 */
@RestController
@Slf4j
public class LoginController {
    @Autowired
    private MenuPermissionMapper menuPermissionMapper;
    @Autowired
    private AdminMapper adminMapper;
    @Autowired
    private UserMapper userMapper;


    /***
     * user & admin获取目录权限
     *
     * @param signedIn 自动注入已登录的操作者的session
     * @return
     */
    @GetMapping("menu_permission")
    public MyResponse<List<MenuPermission>> getUserMenuPermission(@SessionAttribute("signedIn") SignedIn signedIn) {
        LambdaQueryWrapper<MenuPermission> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper
                .eq(MenuPermission::getOrganizationId, signedIn.getOrganizationId())
                .eq(MenuPermission::getDeleted,false);
        return MyResponse.ok(menuPermissionMapper.selectList(lambdaQueryWrapper));
    }


    /**
     * 登出函数，在里面取消AttributeSession参数
     *
     * @param session 参数
     */
    @PostMapping("logout")
    public MyResponse<String> logout(HttpSession session){
        log.info("一个使用者正在登出：{}", session.getAttribute("signedIn"));
        session.invalidate();
        return MyResponse.ok("已成功登出");
    }



    /***
     * 管理员获取信息函数
     * 你千万千万要注意啊啊啊啊啊我的天哪
     * 如果你更换了信息，记得向SessionAttribute里面注入的没有变啊啊啊啊
     *
     * 从Session里面获取的有效值仅限于Id和Admin！！！！
     *
     * @param signedIn session参数
     * @return
     */
    @GetMapping("getInfo")
    public MyResponse<SignedIn> getInfo(@SessionAttribute("signedIn") SignedIn signedIn) {
        SignedIn signedInInfo = new SignedIn();
        if(signedIn.getAdmin()){
            signedInInfo.adminSignedIn(signedIn.getOperatorId(),adminMapper);
        }
        else{
            signedInInfo.userSignedIn(signedIn.getOperatorId(),userMapper);
        }
        return MyResponse.ok(signedInInfo);
    }



    /**
     * 管理员登录函数，在里面注入AttributeSession参数
     * 之后若不带着"admin"身份，将报错400无法发送请求
     *
     * @param session 参数
     */
    @PostMapping("admin/login")
    public MyResponse<Admin> adminLogin(@RequestBody Admin admin, HttpSession session){
        if(admin.getName()==null || admin.getPassword()==null){
            System.out.println("请填写用户名或密码！");
            return MyResponse.error(admin,"请填写用户名或密码！");
        }

        //查询用户
        LambdaQueryWrapper<Admin> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper
                .eq(Admin::getName, admin.getName())
                .eq(Admin::getPassword, admin.getPassword());
        Admin thisAdmin = adminMapper.selectOne(lambdaQueryWrapper);

        if(thisAdmin==null){
            System.out.println("未找到此管理员！");
            return MyResponse.error(admin,"未找到此管理员！");
        }

        log.info("管理员正在登录：{}", thisAdmin);

        //赋予session
        thisAdmin.setToken(session.getId());
        //更新一下数据，主要是记录update_time
        adminMapper.updateById(thisAdmin);
        //注入AttributeSession参数
        session.setAttribute("admin",thisAdmin);


        //赋予普通操作者的session
        SignedIn signedInAdmin = new SignedIn();
        signedInAdmin.adminSignedIn(thisAdmin.getId(),adminMapper);
        session.setAttribute("signedIn",signedInAdmin);
        log.info("构建了一个管理员登录者：{}", signedInAdmin);


        return MyResponse.ok(thisAdmin);
    }


    /**
     * 用户登录函数，在里面注入AttributeSession参数
     * 之后若不带着"user"身份，将报错400无法发送请求
     *
     * @param session 参数
     */
    @PostMapping("user/login")
    public MyResponse<User> userLogin(@RequestBody User user, HttpSession session){
        if(user.getName()==null || user.getPassword()==null){
            System.out.println("请填写用户名或密码！");
            return MyResponse.error(user,"请填写用户名或密码！");
        }

        //查询用户
        LambdaQueryWrapper<User> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper
                .eq(User::getName, user.getName())
                .eq(User::getPassword, user.getPassword());
        User thisUser = userMapper.selectOne(lambdaQueryWrapper);

        if(thisUser==null){
            System.out.println("未找到此用户或密码错误！");
            return MyResponse.error(user,"未找到此用户或密码错误！");
        }

        log.info("用户正在登录：{}", thisUser);

        //赋予管理员session
        thisUser.setToken(session.getId());
        //更新一下数据，主要是记录update_time
        userMapper.updateById(thisUser);
        //注入AttributeSession参数
        session.setAttribute("user",thisUser);


        //赋予普通操作者的session
        SignedIn signedInUser = new SignedIn();
        signedInUser.userSignedIn(thisUser.getId(),userMapper);
        session.setAttribute("signedIn",signedInUser);
        log.info("构建了一个管理员登录者：{}", signedInUser);

        return MyResponse.ok(thisUser);
    }

}
